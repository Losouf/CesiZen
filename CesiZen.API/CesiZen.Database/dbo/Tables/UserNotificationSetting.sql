CREATE TABLE [dbo].[UserNotificationSetting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
    [UserId] INT NOT NULL,
    [EmailEnabled] BIT NOT NULL DEFAULT 1,
    [PushEnabled] BIT NOT NULL DEFAULT 1,
    [WeeklySummary] BIT NOT NULL DEFAULT 1,
    [LastUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_UserNotificationSetting_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE
)
GO

CREATE INDEX [IX_UserNotificationSetting_UserId] ON [dbo].[UserNotificationSetting]([UserId])
