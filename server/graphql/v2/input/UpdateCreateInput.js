import { GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import { IsoDateString } from '../../v1/types';

import { AccountReferenceInput } from './AccountReferenceInput';

export const UpdateCreateInput = new GraphQLInputObjectType({
  name: 'UpdateCreateInput',
  description: 'Input type for UpdateType',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    isPrivate: { type: GraphQLBoolean },
    makePublicOn: { type: IsoDateString },
    html: { type: GraphQLString },
    fromAccount: { type: AccountReferenceInput },
    account: { type: new GraphQLNonNull(AccountReferenceInput) },
  }),
});
