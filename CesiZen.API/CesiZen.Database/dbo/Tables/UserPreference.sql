CREATE TABLE [dbo].[UserPreference]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
    [UserId] INT NOT NULL,
    [EmailNotifications] BIT NOT NULL DEFAULT 1,
    [PushNotifications] BIT NOT NULL DEFAULT 1,
    [DarkTheme] BIT NOT NULL DEFAULT 0,
    [IsProfilePublic] BIT NOT NULL DEFAULT 0,
    [Language] NVARCHAR(10) NOT NULL DEFAULT 'FR',
    CONSTRAINT [FK_UserPreference_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE
)
