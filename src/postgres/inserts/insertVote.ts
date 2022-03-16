const upsertVoteQuery = `
  INSERT INTO df.casted_votes(poll_id, account, vote, signature, amount)
  VALUES(:pollId, :account, :vote, :signature, :amount)
  ON CONFLICT (poll_id, account)
	DO UPDATE SET
		vote = :vote,
		signature = :signature;
`

// import { isAccountFromSnapshot } from '../../express-api/handlers/tokensaleHandlers/utils'
import { OkOrError } from '../../express-api/utils'
import { UpsertVote } from '../../models'
// import { encodeStructId } from '../../substrate/utils'
import { newPgError, runQuery } from '../utils'
import {
  isAccountEligibleForVote,
  getAmountByAccount
} from '../../express-api/handlers/votesHandlers/utils'

export async function upsertVote(signMessage: UpsertVote): Promise<OkOrError> {
  try {
    const {
      message: { vote, pollId },
      signature,
      account
    } = signMessage

    if (!isAccountEligibleForVote(signMessage.account))
      throw new Error('The account don\'t exist in snapshot')

    const amount = getAmountByAccount(account)

    await runQuery(upsertVoteQuery, { account, vote, pollId, amount, signature })
    return { ok: true }
  } catch (err) {
    throw newPgError(err, upsertVote)
  }
}
