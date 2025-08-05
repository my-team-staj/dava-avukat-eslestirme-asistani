using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace dava_avukat_eslestirme_asistani.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // diğer middleware'lere geç
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beklenmeyen bir hata oluştu.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            var message = "Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.";

            switch (ex)
            {
                case ApplicationException appEx:
                    statusCode = HttpStatusCode.BadRequest;
                    message = appEx.Message;
                    break;

                case DbUpdateException dbEx when dbEx.InnerException?.Message.Contains("FOREIGN KEY") == true:
                    statusCode = HttpStatusCode.BadRequest;
                    message = "İlişkili kayıt bulunamadı. Muhtemelen geçersiz çalışma grubu ID’si girildi.";
                    break;
            }

            var result = JsonSerializer.Serialize(new { error = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(result);
        }

    }
}
