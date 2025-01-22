import type { Schema, Struct } from '@strapi/strapi';

export interface MessageMessage extends Struct.ComponentSchema {
  collectionName: 'components_message_messages';
  info: {
    displayName: 'Message';
  };
  attributes: {
    senders: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    text: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'message.message': MessageMessage;
    }
  }
}
