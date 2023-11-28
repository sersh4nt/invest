"""Add backtest results.

Revision ID: 589dafc056a9
Revises: a34c7666e786
Create Date: 2023-05-27 09:11:11.169907

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "589dafc056a9"
down_revision = "a34c7666e786"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "backtest_results",
        sa.Column("task_id", sa.String(), nullable=True),
        sa.Column("robot_id", sa.BigInteger(), nullable=True),
        sa.Column("initial_capital", sa.BigInteger(), nullable=True),
        sa.Column("date_from", sa.DateTime(timezone=True), nullable=True),
        sa.Column("date_to", sa.DateTime(timezone=True), nullable=True),
        sa.Column("interval_raw", sa.String(), nullable=True),
        sa.Column("broker_fee", sa.Float(), nullable=True),
        sa.Column("figi", sa.String(length=12), nullable=True),
        sa.Column("is_started", sa.Boolean(), nullable=True),
        sa.Column("is_finished", sa.Boolean(), nullable=True),
        sa.Column(
            "robot_config", postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
        sa.Column("results", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("relative_yield", sa.Float(), nullable=True),
        sa.Column("absolute_yield", sa.Float(), nullable=True),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["robot_id"], ["robots.id"], name=op.f("backtest_results_robot_id_fkey")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("backtest_results_pkey")),
    )
    op.create_index(
        op.f("backtest_results_id_idx"), "backtest_results", ["id"], unique=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("backtest_results_id_idx"), table_name="backtest_results")
    op.drop_table("backtest_results")
    # ### end Alembic commands ###
