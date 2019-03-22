defmodule TaskTrackerV3.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :user, :string
      add :complete, :boolean, default: false, null: false
      add :title, :string
      add :description, :string
      add :minutes_worked_on, :integer

      timestamps()
    end

  end
end
