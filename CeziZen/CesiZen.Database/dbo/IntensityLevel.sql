CREATE TABLE [dbo].[IntensityLevel] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Label] VARCHAR(100) NOT NULL, 
    [Value] INT NOT NULL,
    CONSTRAINT [PK_IntensityLevel] PRIMARY KEY CLUSTERED ([Id])
);