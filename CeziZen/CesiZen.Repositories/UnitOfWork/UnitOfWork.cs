using CesiZen.Core.Repository;
using CesiZen.Core.Repository.UnitOfWork;
using CesiZen.Repository.Context;

namespace CesiZen.Repository.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CesiZenContext _context;
        private readonly Dictionary<string, object> _repositories = new();

        public UnitOfWork(CesiZenContext context) => _context = context;

        public IGenericRepository<T> Repository<T>() where T : class
        {
            var type = typeof(T).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryInstance = new GenericRepository<T>(_context);
                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<T>)_repositories[type];
        }

        public async Task<int> SaveAsync() => await _context.SaveChangesAsync();

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
