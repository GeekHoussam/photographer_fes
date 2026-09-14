#!/bin/sh
set -eu

if [ "$POSTGRES_DB" != "photographer_fes_test" ]; then
  createdb --username "$POSTGRES_USER" --owner "$POSTGRES_USER" photographer_fes_test
fi
