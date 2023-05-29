"""Add api trade flag

Revision ID: ae71d21ea81d
Revises: fedd30ae8e12
Create Date: 2023-05-29 09:14:36.423432

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ae71d21ea81d'
down_revision = 'fedd30ae8e12'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('instruments', sa.Column('is_tradable', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('instruments', 'is_tradable')
    # ### end Alembic commands ###
