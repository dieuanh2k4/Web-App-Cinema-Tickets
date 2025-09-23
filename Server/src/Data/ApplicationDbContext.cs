using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;

namespace Server.src.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Movies> Movies { get; set; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<Rooms> Rooms { get; set; }
        public DbSet<Seats> Seats { get; set; }
        public DbSet<Showtimes> Showtimes { get; set; }
        public DbSet<StatusSeat> StatusSeat { get; set; }
        public DbSet<Theater> Theater { get; set; }
        public DbSet<Ticket> Ticket { get; set; }
        public DbSet<User> User { get; set; }

        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable(c =>
                {
                    c.HasCheckConstraint("CK_Customer_Gender", "Gender IN('Nam', 'Nữ', 'Khác')");
                });
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(c => c.Name)
                    .IsUnicode(true)
                    .HasMaxLength(20)
                    .IsRequired();
                entity.Property(c => c.Birth)
                    .HasColumnType("date")
                    .IsRequired();
                entity.Property(c => c.gender)
                    .HasMaxLength(1)
                    .IsUnicode(false);
                entity.Property(c => c.Address)
                    .HasMaxLength(255);
                entity.Property(c => c.Phone)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .IsRequired();
                entity.HasIndex(c => c.Phone)
                    .IsUnique();
                entity.Property(c => c.Address)
                    .HasMaxLength(225);
                entity.Property(c => c.Avatar)
                    .HasMaxLength(255);

            });

            modelBuilder.Entity<Movies>(entity =>
            {
                entity.ToTable(m =>
                {
                    m.HasCheckConstraint("CK_Movie_Duration", "Duration > 0");
                    m.HasCheckConstraint("CK_Movie_ReleaseYear", "ReleaseYear <= YEAR(GETDATE())");
                    m.HasCheckConstraint("CK_Movie_Rating", "Rating >= 0 AND Rating <= 10");
                });
                entity.HasKey(m => m.Id);
                entity.Property(c => c.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(m => m.Title)
                    .IsUnicode(true)
                    .HasMaxLength(100)
                    .IsRequired();
                entity.Property(m => m.Thumbnail)
                    .HasMaxLength(255)
                    .IsUnicode(false);
                entity.Property(m => m.Duration)
                    .IsRequired();

                entity.Property(m => m.Genre)
                    .HasMaxLength(10);
                entity.Property(m => m.ReleaseYear)
                    .IsRequired();
                entity.Property(m => m.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(true)
                    .IsRequired(false);

                entity.Ignore(m => m.Actors);
                entity.Property(m => m.Rating)
                    .HasDefaultValue(0)
                    .IsRequired();
                
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable(p =>
                {
                    p.HasCheckConstraint("CK_Payment_TotalPrice", "TotalPrice > 0");
                    p.HasCheckConstraint("CK_Payment_Status", "Status IN('Đã Thanh toán', 'Chưa Thanh toán', 'Thanh toán thất bại')");
                    p.HasCheckConstraint("CK_Payment_paymentMethod", "paymentMethod IN('Momo', 'Banking', 'Cash')");
                });
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(p => p.TicketId)
                    .IsRequired();
                entity.Property(p => p.TotalPrice)
                    .IsRequired();
                entity.Property(p => p.Date)
                    .IsRequired();
                entity.Property(p => p.Status)
                    .HasMaxLength(20);
                entity.Property(p => p.paymentMethod)
                    .HasMaxLength(20);

                entity.HasOne(p => p.Ticket)
                    .WithOne(t => t.Payment)
                    .HasForeignKey<Payment>(p => p.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Rooms>(entity =>
            {
                // entity.ToTable(r =>
                // {
                //     r.HasCheckConstraint("");
                // });
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(r => r.Name)
                    .IsRequired()
                    .HasMaxLength(10);
                entity.Property(r => r.Capacity)
                    .IsRequired();
                entity.Property(r => r.Status)
                    .IsRequired()
                    .HasDefaultValue("Trống");
                entity.Property(r => r.TheaterId)
                    .IsRequired();

                entity.HasOne(r => r.Theater)
                    .WithMany(t => t.Rooms)
                    .HasForeignKey(r => r.TheaterId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Seats>(entity =>
            {
                entity.ToTable(r =>
                {
                    r.HasCheckConstraint("CK_Seats_Price", "Price > 0");
                });
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(s => s.Name)
                    .IsRequired()
                    .HasMaxLength(5);
                entity.Property(s => s.Price)
                    .IsRequired();
                entity.Property(s => s.Type)
                    .IsRequired()
                    .HasMaxLength(20);
                entity.Property(s => s.RoomId)
                    .IsRequired();

                entity.HasOne(s => s.Rooms)
                    .WithMany(r => r.Seats)
                    .HasForeignKey(s => s.RoomId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Showtimes>(entity =>
            {
                // entity.ToTable(r =>
                // {
                //     r.HasCheckConstraint("CK_Seats_Price", "Price > 0");
                // });
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(s => s.Start)
                    .IsRequired();
                entity.Property(s => s.End)
                    .IsRequired();
                entity.Property(s => s.MovieId)
                    .IsRequired();
                entity.Property(s => s.RoomId)
                    .IsRequired();

                entity.HasOne(s => s.Rooms)
                    .WithMany(r => r.Showtimes)
                    .HasForeignKey(s => s.RoomId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Movies)
                    .WithMany(m => m.Showtimes)
                    .HasForeignKey(s => s.MovieId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<StatusSeat>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.SeatId)
                    .IsRequired();
                entity.Property(s => s.ShowtimeId)
                    .IsRequired();
                entity.Property(s => s.Status)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasDefaultValue("Trống");

                entity.HasOne(s => s.Seats)
                    .WithMany(ss => ss.StatusSeat)
                    .HasForeignKey(s => s.SeatId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.Showtimes)
                    .WithMany(sh => sh.StatusSeat)
                    .HasForeignKey(s => s.ShowtimeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Theater>(entity =>
            {
                // entity.ToTable(r =>
                // {
                //     r.HasCheckConstraint("CK_Seats_Price", "Price > 0");
                // });
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(t => t.Name)
                    .IsRequired()
                    .HasMaxLength(20);
                entity.Property(t => t.Address)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(t => t.City)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(u => u.username)
                    .IsRequired()
                    .HasMaxLength(10);
                entity.Property(u => u.password)
                    .IsRequired();
                entity.Property(u => u.userType)
                    .IsRequired();
            });
        }
    }
}