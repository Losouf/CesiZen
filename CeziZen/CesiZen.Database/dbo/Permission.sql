CREATE TABLE [dbo].[Permission] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Label] VARCHAR(100) NOT NULL,
    [Code] VARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ_Permission_Code] UNIQUE ([Code])
);