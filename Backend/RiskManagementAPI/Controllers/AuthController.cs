using Microsoft.AspNetCore.Mvc;
using RiskManagementAPI.Models;
using RiskManagementAPI.Services;

namespace RiskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ActiveDirectoryService _adService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ActiveDirectoryService adService, ILogger<AuthController> logger)
        {
            _adService = adService;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequest request)
        {
            // Validar que se proporcionen credenciales
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "El usuario y la contraseña son requeridos" });
            }

            // Verificar credenciales en Active Directory
            if (!_adService.ValidateCredentials(request.Username, request.Password))
            {
                return Unauthorized(new { message = "Credenciales incorrectas" });
            }

            // Obtener información del usuario
            var user = _adService.GetUserInfo(request.Username);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Generar JWT
            var token = _adService.GenerateJwtToken(user);

            // Devolver respuesta
            return Ok(new AuthResponse
            {
                Token = token,
                User = user,
                Expiration = DateTime.Now.AddHours(8)
            });
        }
        
        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            // Este endpoint solo es accesible con un token válido
            // debido a la configuración de JWT en Program.cs
            return Ok(new { valid = true });
        }
    }
} 