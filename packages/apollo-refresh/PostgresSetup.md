# CreateDB and SuperUser

```sh
➜  apollo-refresh [master*]createdb apollorefresh
➜  apollo-refresh [master*]psql apollorefresh
psql (11.1)
Type "help" for help.

apollorefresh=# CREATE USER apollo SUPERUSER;
CREATE ROLE
apollorefresh=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 apollo    | Superuser                                                  | {}
 prisc_000 | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

apollorefresh=#
```

source for createuser: <https://www.youtube.com/watch?v=lCNl3QKxgP0> at <https://youtu.be/lCNl3QKxgP0?t=69>

```sh
postgres=# CREATE USER postgres SUPERUSER;
CREATE ROLE
postgres=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 apollo    | Superuser                                                  | {}
 postgres  | Superuser                                                  | {}
 prisc_000 | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

postgres=# \q
➜  apollo-refresh [master*]\l
zsh: command not found: l
➜  apollo-refresh [master*]psql postgres
psql (11.1)
Type "help" for help.

postgres=# \l
postgres=# grant all privileges on database postgres to postgres;
GRANT
postgres=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 apollo    | Superuser                                                  | {}
 postgres  | Superuser                                                  | {}
 prisc_000 | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

postgres=# \l
postgres=# \q
```