defmodule TaskTrackerV3.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tasks" do
    field :complete, :boolean, default: false
    field :description, :string
    field :minutes_worked_on, :integer
    field :title, :string
    field :user, :string

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:user, :complete, :title, :description, :minutes_worked_on])
    |> validate_required([:user, :complete, :title, :description, :minutes_worked_on])
  end
end
