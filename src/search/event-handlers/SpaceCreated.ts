import { indexContentFromIpfs } from '../../search/indexer';
import { ES_INDEX_SPACES } from '../../search/config';
import { SpaceId } from '@subsocial/types/substrate/interfaces/subsocial';
import { substrate } from '../../substrate/subscribe';
import { SubstrateEvent, EventHandlerFn } from '../../substrate/types';

export const onSpaceCreated: EventHandlerFn = async (eventAction: SubstrateEvent) => {
  const { data } = eventAction;

  const spaceId = data[1] as SpaceId;
  const space = await substrate.findSpace(spaceId);
  if (!space) return;

  await indexContentFromIpfs(ES_INDEX_SPACES, space.ipfs_hash.toString(), spaceId);
}