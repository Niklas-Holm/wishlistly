"""Add reserved column to Wish model

Revision ID: 96d4c9bf4474
Revises: 
Create Date: 2024-11-26 15:52:04.364415

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '96d4c9bf4474'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reserved', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishes', schema=None) as batch_op:
        batch_op.drop_column('reserved')

    # ### end Alembic commands ###