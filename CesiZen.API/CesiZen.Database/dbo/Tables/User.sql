CREATE TABLE [dbo].[User] (
    [Id]           INT           IDENTITY (1, 1) NOT NULL,
    [Username]     VARCHAR (50)  NOT NULL,
    [Email]        VARCHAR (255) NOT NULL,
    [PasswordHash] VARCHAR (MAX) NOT NULL,
    [DisplayName]  VARCHAR (100) NULL,
    [CreatedAt]    DATETIME2 (7) DEFAULT (getdate()) NULL,
    [RoleId]       INT           NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]),
    CONSTRAINT [UQ_User_Email] UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [UQ_User_Username] UNIQUE NONCLUSTERED ([Username] ASC)
);

