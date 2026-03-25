CREATE TABLE [dbo].[Role] (
    [Id]    INT          IDENTITY (1, 1) NOT NULL,
    [Label] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([Id] ASC)
);

