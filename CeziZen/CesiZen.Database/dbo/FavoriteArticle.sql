CREATE TABLE [dbo].[FavoriteArticle] (
    [UserId] INT NOT NULL,
    [ArticleId] INT NOT NULL,
    CONSTRAINT [PK_FavoriteArticle] PRIMARY KEY ([UserId], [ArticleId]),
    CONSTRAINT [FK_FavoriteArticle_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_FavoriteArticle_Article] FOREIGN KEY ([ArticleId]) REFERENCES [dbo].[InfoArticle] ([Id]) ON DELETE CASCADE
);