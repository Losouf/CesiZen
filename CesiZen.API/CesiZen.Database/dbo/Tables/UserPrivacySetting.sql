CREATE TABLE [dbo].[UserPrivacySetting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
    [UserId] INT NOT NULL,
    [IsProfilePublic] BIT NOT NULL DEFAULT 0,
    [DataSharingConsent] BIT NOT NULL DEFAULT 1,
    [LastUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_UserPrivacySetting_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE
)
GO

CREATE INDEX [IX_UserPrivacySetting_UserId] ON [dbo].[UserPrivacySetting]([UserId])
