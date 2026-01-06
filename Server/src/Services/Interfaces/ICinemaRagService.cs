namespace Server.src.Services.Interfaces
{
    public interface ICinemaRagService
    {
        // RAG: Build context phim + suất chiếu + giá vé
        Task<string> BuildMovieContextAsync();
    }
}
