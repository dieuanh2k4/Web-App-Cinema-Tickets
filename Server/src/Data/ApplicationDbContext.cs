using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;

namespace Server.src.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Movies> Movies { get; set; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<Rooms> Rooms { get; set; }
        public DbSet<Seats> Seats { get; set; }
        public DbSet<Showtimes> Showtimes { get; set; }
        public DbSet<StatusSeat> StatusSeat { get; set; }
        public DbSet<Theater> Theater { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketSeat> TicketSeats { get; set; }
        public DbSet<TicketPrice> TicketPrices { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<OTPCode> OTPCodes { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Staff> Staff { get; set; }

        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) {}

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable(c =>
                {
                    c.HasCheckConstraint("CK_Customer_Gender", "\"Gender\" IN('Nam', 'Nữ', 'Khác')");
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
                    .HasMaxLength(5)
                    .IsUnicode(false);
                entity.Property(c => c.Address)
                    .HasMaxLength(255);
                entity.Property(c => c.Phone)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .IsRequired();
                entity.HasIndex(c => c.Phone)
                    .IsUnique();
                entity.Property(c => c.Avatar)
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Movies>(entity =>
            {
                entity.ToTable(m =>
                {
                    m.HasCheckConstraint("CK_Movie_Duration", "\"Duration\" > 0");
                    m.HasCheckConstraint("CK_Movie_Rating", "\"Rating\" >= 0 AND \"Rating\" <= 10");
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
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .IsRequired();
                entity.Property(m => m.Duration)
                    .IsRequired();
                entity.Property(m => m.Genre)
                    .HasMaxLength(50)
                    .IsRequired();
                entity.Property(m => m.Language)
                    .HasMaxLength(100)
                    .IsRequired();
                entity.Property(m => m.AgeLimit)
                    .HasMaxLength(20)
                    .IsRequired();
                entity.Property(m => m.StartDate)
                    .IsRequired();
                entity.Property(m => m.EndDate)
                    .IsRequired();
                entity.Property(m => m.Description)
                    .HasMaxLength(3000)
                    .IsUnicode(true)
                    .IsRequired();
                entity.Property(m => m.Director)
                    .HasMaxLength(200)
                    .IsRequired();
                entity.Property(m => m.Actors)
                    .HasColumnType("Text[]")
                    .IsRequired();
                entity.Property(m => m.Rating)
                    .HasDefaultValue(0)
                    .IsRequired(); 
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable(p =>
                {
                    p.HasCheckConstraint("CK_Payment_TotalPrice", "\"TotalPrice\" > 0");
                    p.HasCheckConstraint("CK_Payment_Status", "\"Status\" IN('Đã Thanh toán', 'Chưa Thanh toán', 'Thanh toán thất bại')");
                    p.HasCheckConstraint("CK_Payment_paymentMethod", "\"paymentMethod\" IN('Momo', 'Banking', 'Cash')");
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
                    .HasMaxLength(50);
                entity.Property(p => p.paymentMethod)
                    .HasMaxLength(50);

                entity.HasOne(p => p.Ticket)
                    .WithOne(t => t.Payment)
                    .HasForeignKey<Payment>(p => p.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Rooms>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(r => r.Name)
                    .IsRequired()
                    .HasMaxLength(20);
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
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(s => s.Name)
                    .IsRequired()
                    .HasMaxLength(5);
                entity.Property(s => s.Type)
                    .IsRequired()
                    .HasMaxLength(20);
                entity.Property(s => s.RoomId)
                    .IsRequired();
                entity.Property(s => s.Status)
                    .HasMaxLength(10)
                    .IsRequired();
                entity.Ignore(s => s.Rooms);

                entity.HasOne(s => s.Rooms)
                    .WithMany(r => r.Seats)
                    .HasForeignKey(s => s.RoomId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Showtimes>(entity =>
            {
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
                entity.Property(s => s.Date)
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

            modelBuilder.Entity<Theater>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(t => t.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(t => t.Address)
                    .IsRequired()
                    .HasMaxLength(1000);
                entity.Property(t => t.City)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<TicketPrice>(entity =>
            {
                entity.ToTable(t =>
                {
                    t.HasCheckConstraint("CK_Seats_Price", "\"Price\" > 0");
                });
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(t => t.Price)
                    .IsRequired();
                entity.Property(t => t.RoomType)
                    .HasMaxLength(100)
                    .IsRequired();
                entity.Property(t => t.SeatType)
                    .HasMaxLength(100)
                    .IsRequired();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable(c =>
                {
                    c.HasCheckConstraint("CK_User_Gender", "\"Gender\" IN('Nam', 'Nữ', 'Khác')");
                });
                entity.HasKey(u => u.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(u => u.Name)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(u => u.Birth)
                    .IsRequired();
                entity.Property(u => u.Gender)
                    .IsRequired()
                    .HasMaxLength(10);
                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(u => u.username)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(u => u.password)
                    .IsRequired();
                entity.Property(u => u.phoneNumber)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(u => u.createdDate);
                entity.Property(u => u.Address)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(u => u.Avatar)
                    // .IsRequired()
                    .HasMaxLength(1000);
            });

            modelBuilder.Entity<Roles>(entity => {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(r => r.Name)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(r => r.Description)
                    .HasMaxLength(255);
                entity.Property(r => r.CreatedDate);
                entity.Property(r => r.UpdatedDate);
                // Unique index cho Role Name
                entity.HasIndex(r => r.Name)
                    .IsUnique();
            });

            modelBuilder.Entity<Permission>(entity => {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(p => p.Code)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(p => p.Description)
                    .HasMaxLength(255);
                entity.Property(p => p.Module)
                    .HasMaxLength(255);
                entity.Property(p => p.CreatedDate);
                // Unique index cho Permission Code
                entity.HasIndex(p => p.Code)
                    .IsUnique();
            });

            modelBuilder.Entity<UserRole>(entity => {
                entity.HasKey(ur => ur.Id);
                entity.Property(ur => ur.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(ur => ur.UserId)
                    .IsRequired();
                entity.Property(ur => ur.RoleId)
                    .IsRequired();
                entity.Property(ur => ur.AssignedByUserId);
                entity.Property(ur => ur.AssignedDate)
                    .IsRequired();
                
                // Khóa ngoại: User relationship
                entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Khóa ngoại: Role relationship
                entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
            
                // Unique index để tránh duplicate (1 user không được gán 1 role 2 lần)
                entity.HasIndex(ur => new { ur.UserId, ur.RoleId })
                    .IsUnique();
            });

            modelBuilder.Entity<RolePermission>(entity => {
                entity.HasKey(rp => rp.Id);
                entity.Property(rp => rp.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(rp => rp.RoleId)
                    .IsRequired();
                entity.Property(rp => rp.PermissionId)
                    .IsRequired();
                entity.Property(rp => rp.AssignedDate)
                    .IsRequired();
                
                // Khóa ngoại: Role relationship
                entity.HasOne(rp => rp.Role)
                    .WithMany(r => r.RolePermissions)
                    .HasForeignKey(rp => rp.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Khóa ngoại: Permission relationship
                entity.HasOne(rp => rp.Permission)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(rp => rp.PermissionId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Unique index để tránh duplicate (1 role không được gán 1 permission 2 lần)
                entity.HasIndex(rp => new { rp.RoleId, rp.PermissionId })
                    .IsUnique();
            });

            // StatusSeat unique constraint
            modelBuilder.Entity<StatusSeat>(entity => {
                entity.HasIndex(ss => new { ss.ShowtimeId, ss.SeatId })
                    .IsUnique()
                    .HasFilter("\"Status\" IN ('Booked', 'Pending')");
            });

            // Ticket configuration
            modelBuilder.Entity<Ticket>(entity => {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(t => t.ShowtimeId)
                    .IsRequired();
                entity.Property(t => t.UserId)
                    .IsRequired();
                entity.Property(t => t.RoomId)
                    .IsRequired();
                entity.Property(t => t.MovieId)
                    .IsRequired();
                entity.Property(t => t.SumOfSeat)
                    .IsRequired();
                entity.Property(t => t.Date)
                    .IsRequired();
                entity.Property(t => t.TotalPrice)
                    .IsRequired();

                // Relationships
                entity.HasOne(t => t.Showtimes)
                    .WithMany()
                    .HasForeignKey(t => t.ShowtimeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.Rooms)
                    .WithMany()
                    .HasForeignKey(t => t.RoomId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.Movies)
                    .WithMany()
                    .HasForeignKey(t => t.MovieId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // TicketSeat configuration
            modelBuilder.Entity<TicketSeat>(entity => {
                entity.HasKey(ts => ts.Id);
                
                entity.HasOne(ts => ts.Ticket)
                    .WithMany(t => t.TicketSeats)
                    .HasForeignKey(ts => ts.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(ts => ts.Seat)
                    .WithMany()
                    .HasForeignKey(ts => ts.SeatId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable(c =>
                {
                    c.HasCheckConstraint("CK_Admin_Gender", "\"Gender\" IN('Nam', 'Nữ', 'Khác')");
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
                entity.Property(c => c.Gender)
                    .HasMaxLength(5)
                    .IsUnicode(false);
                entity.Property(c => c.Address)
                    .HasMaxLength(255);
                entity.Property(c => c.Phone)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .IsRequired();
                entity.HasIndex(c => c.Phone)
                    .IsUnique();
                entity.Property(c => c.Avatar)
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Staff>(entity =>
            {
                entity.ToTable(c =>
                {
                    c.HasCheckConstraint("CK_Staff_Gender", "\"Gender\" IN('Nam', 'Nữ', 'Khác')");
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
                entity.Property(c => c.Gender)
                    .HasMaxLength(5)
                    .IsUnicode(false);
                entity.Property(c => c.Address)
                    .HasMaxLength(255);
                entity.Property(c => c.Phone)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .IsRequired();
                entity.HasIndex(c => c.Phone)
                    .IsUnique();
                entity.Property(c => c.Avatar)
                    .HasMaxLength(255);
            });
        }
    }
}