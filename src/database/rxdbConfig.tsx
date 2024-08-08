/* eslint-disable no-console */
import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
  addRxPlugin,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';


import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

export const heroSchemaLiteral = {
  title: 'hero schema',
  description: 'describes a human being',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      },
      age: {
          type: 'integer'
      }
  },
  required: ['firstName', 'lastName', 'id'],
} as const;

const schemaTyped = toTypedRxJsonSchema(heroSchemaLiteral);

// aggregate the document type from the schema
export type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const heroSchema: RxJsonSchema<HeroDocType> = heroSchemaLiteral;

export type HeroDocMethods = {
  scream: (v: string) => string;
};

export type HeroDocument = RxDocument<HeroDocType, HeroDocMethods>;

// we declare one static ORM-method for the collection
export type HeroCollectionMethods = {
  countAllDocuments: () => Promise<number>;
}

// and then merge all our types
export type HeroCollection = RxCollection<HeroDocType, HeroDocMethods, HeroCollectionMethods>;

export type MyDatabaseCollections = {
  heroes: HeroCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>;


const heroDocMethods: HeroDocMethods = {
  scream: function(this: HeroDocument, what: string) {
      return this.firstName + ' screams: ' + what.toUpperCase();
  }
};
const heroCollectionMethods: HeroCollectionMethods = {
  countAllDocuments: async function(this: HeroCollection) {
      const allDocs = await this.find().exec();
      return allDocs.length;
  }
};


let dbPromise : Promise<MyDatabase>;
const _create = async () => {
  console.log('Creating database...');
  /**
   * create database and collections
   */
  const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: 'mydb2',
    storage: getRxStorageDexie ()
  });


  await db.addCollections({
    heroes: {
        schema: heroSchema,
        methods: heroDocMethods,
        statics: heroCollectionMethods
    }
});

  return db;
};

export const getDatabase = () => {
  if (!dbPromise) {
    dbPromise = _create();
  }
  return dbPromise;
};
