using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using RiskManagementAPI.Models;

namespace RiskManagementAPI.Services
{
    public class MockActiveDirectoryService : ActiveDirectoryService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ActiveDirectoryService> _logger;

        public MockActiveDirectoryService(IConfiguration configuration, ILogger<ActiveDirectoryService> logger) 
            : base(configuration, logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        // Sobreescribimos el método para validar credenciales
        public new bool ValidateCredentials(string username, string password)
        {
            // Para desarrollo, permitimos credenciales fijas
            if (username == "admin" && password == "password")
            {
                return true;
            }
            else if (username == "user" && password == "password")
            {
                return true;
            }
            return false;
        }

        // Sobreescribimos el método para obtener información del usuario
        public new User GetUserInfo(string username)
        {
            // Simulamos usuarios de ejemplo
            if (username == "admin")
            {
                return new User
                {
                    Id = "1",
                    Username = "admin",
                    Email = "admin@example.com",
                    DisplayName = "Administrador",
                    Roles = new List<string> { "Administrators", "Users" }
                };
            }
            else if (username == "user")
            {
                return new User
                {
                    Id = "2",
                    Username = "user",
                    Email = "user@example.com",
                    DisplayName = "Usuario Normal",
                    Roles = new List<string> { "Users" }
                };
            }
            return null;
        }
    }
} 