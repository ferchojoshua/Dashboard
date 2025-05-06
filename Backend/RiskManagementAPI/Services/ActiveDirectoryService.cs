using System.DirectoryServices.AccountManagement;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RiskManagementAPI.Models;

namespace RiskManagementAPI.Services
{
    public class ActiveDirectoryService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ActiveDirectoryService> _logger;

        public ActiveDirectoryService(IConfiguration configuration, ILogger<ActiveDirectoryService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public bool ValidateCredentials(string username, string password)
        {
            try
            {
                // Obtenemos el dominio del appsettings.json
                string domain = _configuration["ActiveDirectory:Domain"];
                
                // Verificamos las credenciales contra Active Directory
                using (var context = new PrincipalContext(ContextType.Domain, domain))
                {
                    return context.ValidateCredentials(username, password);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar credenciales en Active Directory");
                return false;
            }
        }

        public User GetUserInfo(string username)
        {
            try
            {
                string domain = _configuration["ActiveDirectory:Domain"];
                
                using (var context = new PrincipalContext(ContextType.Domain, domain))
                {
                    // Buscamos el usuario en AD
                    var userPrincipal = UserPrincipal.FindByIdentity(context, username);
                    
                    if (userPrincipal == null)
                    {
                        return null;
                    }

                    // Obtenemos los grupos (roles) del usuario
                    var groups = userPrincipal.GetGroups().Select(g => g.Name).ToList();
                    
                    return new User
                    {
                        Id = userPrincipal.Guid.ToString(),
                        Username = userPrincipal.SamAccountName,
                        Email = userPrincipal.EmailAddress ?? "",
                        DisplayName = userPrincipal.DisplayName ?? "",
                        Roles = groups
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener información del usuario de Active Directory");
                return null;
            }
        }

        public string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Creamos los claims para el token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id),
                new Claim("name", user.DisplayName)
            };

            // Agregamos los roles como claims
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Creamos el token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 