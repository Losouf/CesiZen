CREATE TABLE [dbo].[User] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Username] VARCHAR(50) NOT NULL,
    [Email] VARCHAR(255) NOT NULL,
    [PasswordHash] VARCHAR(MAX) NOT NULL,
    [DisplayName] VARCHAR(100) NULL,
    [CreatedAt] DATETIME2 DEFAULT GETDATE(),
    [RoleId] INT NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ_User_Username] UNIQUE ([Username]),
    CONSTRAINT [UQ_User_Email] UNIQUE ([Email]),
    CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) 
        REFERENCES [dbo].[Role] ([Id])
);