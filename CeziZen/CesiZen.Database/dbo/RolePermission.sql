CREATE TABLE [dbo].[RolePermission] (
    [RoleId] INT NOT NULL,
    [PermissionId] INT NOT NULL,
    CONSTRAINT [PK_RolePermission] PRIMARY KEY ([RoleId], [PermissionId]),
    CONSTRAINT [FK_RolePermission_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RolePermission_Permission] FOREIGN KEY ([PermissionId]) REFERENCES [dbo].[Permission] ([Id]) ON DELETE CASCADE
);