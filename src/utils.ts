import { asAccountId } from '@subsocial/api';
import { AnyAccountId } from '@subsocial/types';
import { readFile, writeFile, mkdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util'

export const stateDirPath = join(__dirname, '../state')

export const asyncReadFile = promisify(readFile)
export const asyncWriteFile = promisify(writeFile)
export const asyncMkdir = promisify(mkdir)

type MaybeAccAddr = undefined | AnyAccountId

export function equalAddresses (addr1: MaybeAccAddr, addr2: MaybeAccAddr): boolean {
  if (addr1 === addr2) {
    return true
  } else if (!addr1 || !addr2) {
    return false
  } else {
    return asAccountId(addr1)?.eq(asAccountId(addr2)) || false
  }
}
