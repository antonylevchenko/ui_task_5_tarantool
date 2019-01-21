#!/usr/bin/env tarantool
box.cfg
{
  pid_file = nil,
  background = false,
  log_level = 5
}

local tokens_space = box.schema.space.create('tokens', {
  if_not_exists = true
})

tokens_space:create_index('primary_id', {
  if_not_exists = true,
  type = 'HASH',
  unique = true,
  parts = {1, 'STRING'}
})
