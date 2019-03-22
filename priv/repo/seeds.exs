# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     TaskTracker.Repo.insert!(%TaskTracker.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias TaskTrackerV3.Repo
alias TaskTrackerV3.Users.User
alias TaskTrackerV3.Tasks.Task


test_hash = Argon2.hash_pwd_salt("test")

Repo.insert!(%User{name: "Alice", password_hash: test_hash})
Repo.insert!(%User{name: "Bob", password_hash: test_hash})
Repo.insert!(%User{name: "Carson", password_hash: test_hash})

Repo.insert!(%Task{
  title: "Web Dev homework",
  description: "HW08",
  minutes_worked_on: 600,
  completed: true,
  user_id: 3
})

Repo.insert!(%Task{
  title: "Apply for co-op",
  description: "At Amazon",
  minutes_worked_on: 60,
  completed: false,
  user_id: 2
})

Repo.insert!(%Task{
  title: "Apply for co-op",
  description: "At Google",
  minutes_worked_on: 0,
  completed: false,
  user_id: 2
})
