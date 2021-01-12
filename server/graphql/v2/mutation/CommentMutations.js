import { GraphQLNonNull, GraphQLString } from 'graphql';

import { createCommentResolver, deleteComment, editComment } from '../../common/comment';
import { getDecodedId, idDecode, IDENTIFIER_TYPES } from '../identifiers';
import { CommentCreateInput } from '../input/CommentCreateInput';
import { CommentUpdateInput } from '../input/CommentUpdateInput';
import { fetchExpenseWithReference } from '../input/ExpenseReferenceInput';
import { fetchUpdateWithReference } from '../input/UpdateReferenceInput';
import { Comment } from '../object/Comment';

const commentMutations = {
  editComment: {
    type: Comment,
    args: {
      comment: {
        type: new GraphQLNonNull(CommentUpdateInput),
      },
    },
    resolve(_, { comment }, { remoteUser }) {
      const commentToEdit = { ...comment, id: getDecodedId(comment.id) };
      return editComment(commentToEdit, remoteUser);
    },
  },
  deleteComment: {
    type: Comment,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(_, { id }, { remoteUser }) {
      const decodedId = getDecodedId(id);
      return deleteComment(decodedId, remoteUser);
    },
  },
  createComment: {
    type: Comment,
    args: {
      comment: {
        type: new GraphQLNonNull(CommentCreateInput),
      },
    },
    resolve: async (entity, args, req) => {
      if (args.comment.ConversationId) {
        args.comment.ConversationId = idDecode(args.comment.ConversationId, IDENTIFIER_TYPES.CONVERSATION);
      }

      if (args.comment.update) {
        const update = await fetchUpdateWithReference(args.comment.update, req);
        if (!update) {
          throw new Error('This update does not exist');
        }
        args.comment.UpdateId = update.id;
      }

      if (args.comment.expense) {
        const expense = await fetchExpenseWithReference(args.comment.expense, req);
        if (!expense) {
          throw new Error('This expense does not exist');
        }
        args.comment.ExpenseId = expense.id;
      }

      return createCommentResolver(entity, args, req);
    },
  },
};

export default commentMutations;
