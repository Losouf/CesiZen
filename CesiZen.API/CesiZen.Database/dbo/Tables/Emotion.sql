CREATE TABLE [dbo].[Emotion] (
    [Id]              INT           IDENTITY (1, 1) NOT NULL,
    [Label]           VARCHAR (100) NOT NULL,
    [Color]           VARCHAR (7)   NULL,
    [ParentId]        INT           NULL,
    [CreatedByUserId] INT           NULL,
    CONSTRAINT [PK_Emotion] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Emotion_Parent] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[Emotion] ([Id]),
    CONSTRAINT [FK_Emotion_User] FOREIGN KEY ([CreatedByUserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE SET NULL
);

