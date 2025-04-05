-- Procedimiento para obtener estadísticas de transacciones
CREATE PROCEDURE sp_GetTransactionStats
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Obtener totales de transacciones
    SELECT 
        1 as Id,
        'Transacciones Totales' as Title,
        COUNT(*) as Count,
        'ring' as Type,
        'Completadas' as Label1,
        SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) as Value1,
        '#5cb85c' as Color1,
        'En Proceso' as Label2,
        SUM(CASE WHEN Status = 'processing' THEN 1 ELSE 0 END) as Value2,
        '#f0ad4e' as Color2,
        'Fallidas' as Label3,
        SUM(CASE WHEN Status = 'failed' THEN 1 ELSE 0 END) as Value3,
        '#d9534f' as Color3
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE())
    
    UNION ALL
    
    -- Obtener transacciones por hora
    SELECT 
        2 as Id,
        'Transacciones por Hora' as Title,
        COUNT(*) as Count,
        'bar' as Type,
        CONVERT(varchar(5), DATEADD(HOUR, -2, GETDATE()), 108) as Label1,
        COUNT(CASE WHEN CreatedAt >= DATEADD(HOUR, -2, GETDATE()) AND CreatedAt < DATEADD(HOUR, -1, GETDATE()) THEN 1 END) as Value1,
        '#5bc0de' as Color1,
        CONVERT(varchar(5), DATEADD(HOUR, -1, GETDATE()), 108) as Label2,
        COUNT(CASE WHEN CreatedAt >= DATEADD(HOUR, -1, GETDATE()) AND CreatedAt < GETDATE() THEN 1 END) as Value2,
        '#5bc0de' as Color2,
        CONVERT(varchar(5), GETDATE(), 108) as Label3,
        COUNT(CASE WHEN CreatedAt >= GETDATE() THEN 1 END) as Value3,
        '#5bc0de' as Color3
    FROM Transactions
    WHERE CreatedAt >= DATEADD(HOUR, -2, GETDATE())
    
    UNION ALL
    
    -- Obtener tasa de éxito
    SELECT 
        3 as Id,
        'Tasa de Éxito' as Title,
        CAST(SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as INT) as Count,
        'circular' as Type,
        'Exitosas' as Label1,
        CAST(SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as INT) as Value1,
        '#5cb85c' as Color1,
        'Fallidas' as Label2,
        CAST(SUM(CASE WHEN Status = 'failed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as INT) as Value2,
        '#d9534f' as Color2,
        '' as Label3,
        0 as Value3,
        '' as Color3
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE())
    
    UNION ALL
    
    -- Obtener nivel de servicio
    SELECT 
        4 as Id,
        'Nivel de Servicio' as Title,
        CAST(AVG(CASE WHEN ResponseTime <= 5000 THEN 100 ELSE 0 END) as INT) as Count,
        'indicator' as Type,
        'Actual' as Label1,
        CAST(AVG(CASE WHEN ResponseTime <= 5000 THEN 100 ELSE 0 END) as INT) as Value1,
        '#5cb85c' as Color1,
        'Objetivo' as Label2,
        90 as Value2,
        '#f0ad4e' as Color2,
        '' as Label3,
        0 as Value3,
        '' as Color3
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE());
END
GO

-- Procedimiento para obtener dispositivos monitoreados
CREATE PROCEDURE sp_GetMonitoredDevices
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        Type,
        Status,
        LastCheck,
        CpuUsage,
        MemoryUsage,
        DiskUsage,
        Uptime
    FROM MonitoredDevices;
END
GO

-- Procedimiento para agregar un dispositivo monitoreado
CREATE PROCEDURE sp_AddMonitoredDevice
    @Name nvarchar(100),
    @Type nvarchar(50),
    @Status nvarchar(50),
    @LastCheck datetime,
    @CpuUsage int,
    @MemoryUsage int,
    @DiskUsage int,
    @Uptime nvarchar(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO MonitoredDevices (
        Name,
        Type,
        Status,
        LastCheck,
        CpuUsage,
        MemoryUsage,
        DiskUsage,
        Uptime
    )
    VALUES (
        @Name,
        @Type,
        @Status,
        @LastCheck,
        @CpuUsage,
        @MemoryUsage,
        @DiskUsage,
        @Uptime
    );
    
    SELECT 
        Id,
        Name,
        Type,
        Status,
        LastCheck,
        CpuUsage,
        MemoryUsage,
        DiskUsage,
        Uptime
    FROM MonitoredDevices
    WHERE Id = SCOPE_IDENTITY();
END
GO

-- Procedimiento para actualizar el estado de un dispositivo
CREATE PROCEDURE sp_UpdateDeviceStatus
    @Id int,
    @Status nvarchar(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE MonitoredDevices
    SET 
        Status = @Status,
        LastCheck = GETDATE()
    WHERE Id = @Id;
END
GO

-- Procedimiento para obtener transacciones por hora
CREATE PROCEDURE sp_GetHourlyTransactions
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        DATEPART(HOUR, CreatedAt) as Hour,
        COUNT(*) as Count
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE())
    GROUP BY DATEPART(HOUR, CreatedAt)
    ORDER BY Hour;
END
GO

-- Procedimiento para obtener tasa de éxito
CREATE PROCEDURE sp_GetSuccessRate
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        CAST(SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as INT) as SuccessRate,
        COUNT(*) as TotalTransactions,
        SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) as CompletedTransactions,
        SUM(CASE WHEN Status = 'failed' THEN 1 ELSE 0 END) as FailedTransactions
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE());
END
GO

-- Procedimiento para obtener nivel de servicio
CREATE PROCEDURE sp_GetServiceLevel
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        CAST(AVG(CASE WHEN ResponseTime <= 5000 THEN 100 ELSE 0 END) as INT) as ServiceLevel,
        90 as TargetLevel,
        AVG(ResponseTime) as AverageResponseTime,
        COUNT(*) as TotalTransactions
    FROM Transactions
    WHERE CreatedAt >= DATEADD(day, -1, GETDATE());
END
GO 