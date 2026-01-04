using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RedLockNet;

namespace Server.src.Services.Interfaces
{
    public interface IDistributedLockService
    {
        Task<IRedLock?> AcquireLockAsync(
            string resource,
            TimeSpan? expiryTime = null,
            TimeSpan? waitTime = null,
            TimeSpan? retryTime = null
        );

        Task<T?> ExecuteWithLockAsync<T>(
            string resource,
            Func<Task<T>> action,
            TimeSpan? expiryTime = null
        );

        Task ExecuteWithLockAsync(
            string resource,
            Func<Task> action,
            TimeSpan? expiryTime = null
        );
    }
}