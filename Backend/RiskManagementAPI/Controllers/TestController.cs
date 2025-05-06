using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RiskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetPublicData()
        {
            return Ok(new { message = "Estos son datos públicos, no requieren autenticación" });
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult GetProtectedData()
        {
            return Ok(new { message = "Estos son datos protegidos, requieren autenticación" });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Administrators")]
        public IActionResult GetAdminData()
        {
            return Ok(new { message = "Estos son datos de administrador, requieren rol de Administrators" });
        }
    }
} 