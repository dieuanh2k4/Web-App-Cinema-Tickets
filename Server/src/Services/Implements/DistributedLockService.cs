using RedLockNet.SERedis;
using RedLockNet.SERedis.Configuration;
using StackExchange.Redis;
using IRedLock = RedLockNet.IRedLock;

namespace Server.src.Services.Implements;

/// <summary>
/// Distributed lock service using RedLock algorithm
/// Đảm bảo atomic operations khi hold/release seats trong môi trường distributed
/// </summary>
public class DistributedLockService
{
    private readonly RedLockFactory _redLockFactory;
    private readonly ILogger<DistributedLockService> _logger;

    public DistributedLockService(
        IConnectionMultiplexer redis,
        ILogger<DistributedLockService> logger)
    {
        _logger = logger;
        
        // Setup RedLock with single Redis instance (can be expanded to multiple instances for HA)
        var endPoints = new List<RedLockMultiplexer>
        {
            new RedLockMultiplexer(redis)
        };
        
        _redLockFactory = RedLockFactory.Create(endPoints);
    }

    /// <summary>
    /// Acquire distributed lock với timeout
    /// </summary>
    /// <param name="resource">Lock key (e.g., "seat_lock:1:10")</param>
    /// <param name="expiryTime">Lock timeout (default 5 seconds)</param>
    /// <param name="waitTime">Thời gian chờ acquire lock (default 3 seconds)</param>
    /// <param name="retryTime">Retry interval (default 200ms)</param>
    /// <returns>RedLock instance (dispose để release lock)</returns>
    public async Task<IRedLock?> AcquireLockAsync(
        string resource,
        TimeSpan? expiryTime = null,
        TimeSpan? waitTime = null,
        TimeSpan? retryTime = null)
    {
        var expiry = expiryTime ?? TimeSpan.FromSeconds(5);
        var wait = waitTime ?? TimeSpan.FromSeconds(3);
        var retry = retryTime ?? TimeSpan.FromMilliseconds(200);

        try
        {
            var redLock = await _redLockFactory.CreateLockAsync(
                resource,
                expiry,
                wait,
                retry
            );

            if (redLock.IsAcquired)
            {
                _logger.LogDebug("Acquired lock for resource: {Resource}", resource);
                return redLock;
            }

            _logger.LogWarning("Failed to acquire lock for resource: {Resource}", resource);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error acquiring lock for resource: {Resource}", resource);
            return null;
        }
    }

    /// <summary>
    /// Execute action với distributed lock protection
    /// </summary>
    public async Task<T?> ExecuteWithLockAsync<T>(
        string resource,
        Func<Task<T>> action,
        TimeSpan? expiryTime = null)
    {
        var redLock = await AcquireLockAsync(resource, expiryTime);
        
        if (redLock == null || !redLock.IsAcquired)
        {
            throw new InvalidOperationException($"Could not acquire lock for resource: {resource}");
        }

        try
        {
            return await action();
        }
        finally
        {
            redLock.Dispose(); // Release lock
            _logger.LogDebug("Released lock for resource: {Resource}", resource);
        }
    }

    /// <summary>
    /// Execute action với distributed lock protection (void return)
    /// </summary>
    public async Task ExecuteWithLockAsync(
        string resource,
        Func<Task> action,
        TimeSpan? expiryTime = null)
    {
        var redLock = await AcquireLockAsync(resource, expiryTime);
        
        if (redLock == null || !redLock.IsAcquired)
        {
            throw new InvalidOperationException($"Could not acquire lock for resource: {resource}");
        }

        try
        {
            await action();
        }
        finally
        {
            redLock.Dispose(); // Release lock
            _logger.LogDebug("Released lock for resource: {Resource}", resource);
        }
    }
}
