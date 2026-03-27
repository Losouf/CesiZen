CREATE TABLE [dbo].[JournalEntry] (
    [Id]               INT           IDENTITY (1, 1) NOT NULL,
    [LoggedAt]         DATETIME2 (7) DEFAULT (getdate()) NOT NULL,
    [Content]          TEXT          NULL,
    [UserId]           INT           NOT NULL,
    [EmotionId]        INT           NOT NULL,
    CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_JournalEntry_Emotion] FOREIGN KEY ([EmotionId]) REFERENCES [dbo].[Emotion] ([Id]),
    CONSTRAINT [FK_JournalEntry_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE
);
