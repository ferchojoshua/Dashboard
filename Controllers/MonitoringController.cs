using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class MonitoringController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public MonitoringController(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection");
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactionStats()
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Ejecutar el stored procedure para obtener estadísticas
                var stats = await connection.QueryAsync<dynamic>(
                    "sp_GetTransactionStats",
                    commandType: CommandType.StoredProcedure
                );

                // Formatear los datos para el frontend
                var formattedStats = stats.Select(s => new
                {
                    id = s.Id.ToString(),
                    title = s.Title,
                    count = s.Count,
                    type = s.Type,
                    segments = new[]
                    {
                        new { label = s.Label1, value = s.Value1, color = s.Color1 },
                        new { label = s.Label2, value = s.Value2, color = s.Color2 },
                        new { label = s.Label3, value = s.Value3, color = s.Color3 }
                    }
                });

                return Ok(formattedStats);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener estadísticas", error = ex.Message });
        }
    }

    [HttpGet("devices")]
    public async Task<IActionResult> GetMonitoredDevices()
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Ejecutar el stored procedure para obtener dispositivos
                var devices = await connection.QueryAsync<dynamic>(
                    "sp_GetMonitoredDevices",
                    commandType: CommandType.StoredProcedure
                );

                return Ok(devices);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener dispositivos", error = ex.Message });
        }
    }

    [HttpGet("hourly-transactions")]
    public async Task<IActionResult> GetHourlyTransactions()
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var transactions = await connection.QueryAsync<dynamic>(
                    "sp_GetHourlyTransactions",
                    commandType: CommandType.StoredProcedure
                );

                return Ok(transactions);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener transacciones por hora", error = ex.Message });
        }
    }

    [HttpGet("success-rate")]
    public async Task<IActionResult> GetSuccessRate()
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var rate = await connection.QueryFirstAsync<dynamic>(
                    "sp_GetSuccessRate",
                    commandType: CommandType.StoredProcedure
                );

                return Ok(rate);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener tasa de éxito", error = ex.Message });
        }
    }

    [HttpGet("service-level")]
    public async Task<IActionResult> GetServiceLevel()
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var level = await connection.QueryFirstAsync<dynamic>(
                    "sp_GetServiceLevel",
                    commandType: CommandType.StoredProcedure
                );

                return Ok(level);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener nivel de servicio", error = ex.Message });
        }
    }

    [HttpPost("devices")]
    public async Task<IActionResult> AddDevice([FromBody] DeviceRequest request)
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@Name", request.Name);
                parameters.Add("@Type", request.Type);
                parameters.Add("@Status", request.Status);
                parameters.Add("@LastCheck", DateTime.Now);
                parameters.Add("@CpuUsage", 0);
                parameters.Add("@MemoryUsage", 0);
                parameters.Add("@DiskUsage", 0);
                parameters.Add("@Uptime", "0d 0h 0m");

                var newDevice = await connection.QueryFirstAsync<dynamic>(
                    "sp_AddMonitoredDevice",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(newDevice);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al agregar dispositivo", error = ex.Message });
        }
    }

    [HttpPut("devices/{id}/status")]
    public async Task<IActionResult> UpdateDeviceStatus(string id, [FromBody] StatusRequest request)
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@Id", id);
                parameters.Add("@Status", request.Status);

                await connection.ExecuteAsync(
                    "sp_UpdateDeviceStatus",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Estado actualizado correctamente" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al actualizar estado", error = ex.Message });
        }
    }
}

public class DeviceRequest
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
}

public class StatusRequest
{
    public string Status { get; set; }
} 