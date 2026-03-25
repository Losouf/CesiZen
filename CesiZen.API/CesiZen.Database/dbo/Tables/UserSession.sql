CREATE TABLE [dbo].[UserSession] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [Token]     VARCHAR (MAX) NOT NULL,
    [JwtId]     VARCHAR (255) NOT NULL,
    [IsUsed]    BIT           DEFAULT ((0)) NOT NULL,
    [IsRevoked] BIT           DEFAULT ((0)) NOT NULL,
    [CreatedAt] DATETIME2 (7) DEFAULT (getdate()) NOT NULL,
    [ExpiresAt] DATETIME2 (7) NOT NULL,
    [UserId]    INT           NOT NULL,
    CONSTRAINT [PK_UserSession] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserSession_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE
);

