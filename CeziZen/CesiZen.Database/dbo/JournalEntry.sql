CREATE TABLE [dbo].[JournalEntry] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [LoggedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [Content] TEXT NULL,
    [UserId] INT NOT NULL,
    [EmotionId] INT NOT NULL,
    [IntensityLevelId] INT NOT NULL,
    CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_JournalEntry_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_JournalEntry_Emotion] FOREIGN KEY ([EmotionId]) REFERENCES [dbo].[Emotion] ([Id]),
    CONSTRAINT [FK_JournalEntry_Intensity] FOREIGN KEY ([IntensityLevelId]) REFERENCES [dbo].[IntensityLevel] ([Id])
);