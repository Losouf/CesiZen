CREATE TABLE [dbo].[InfoArticle] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Title]       VARCHAR (255) NOT NULL,
    [Body]        TEXT          NOT NULL,
    [PublishedAt] DATETIME2 (7) DEFAULT (getdate()) NOT NULL,
    [AuthorId]    INT           NOT NULL,
    [ReadTime]    INT           NULL,
    [ImageUrl]    VARCHAR (500) NULL,
    CONSTRAINT [PK_InfoArticle] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_InfoArticle_Author] FOREIGN KEY ([AuthorId]) REFERENCES [dbo].[User] ([Id])
);

