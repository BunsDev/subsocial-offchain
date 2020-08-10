import { indexContentFromIpfs } from '../../search/indexer';
import { ES_INDEX_PROFILES } from '../../search/config';
import { AccountId } from '@subsocial/types/substrate/interfaces/runtime';
import { substrate } from '../../substrate/subscribe';
import { SubstrateEvent, EventHandlerFn } from '../../substrate/types';

export const onProfileUpdated: EventHandlerFn = async (eventAction: SubstrateEvent) => {
  const { data } = eventAction;
  const accountId = data[0] as AccountId;
  const socialAccount = await substrate.findSocialAccount(accountId)
  if (!socialAccount) return;

  const profileOpt = socialAccount.profile;
  if (profileOpt.isNone) return;

  const profile = profileOpt.unwrap();
  await indexContentFromIpfs(ES_INDEX_PROFILES, profile.content.asIpfs.toString(), accountId, { handle: profile.handle.toString() });
}
