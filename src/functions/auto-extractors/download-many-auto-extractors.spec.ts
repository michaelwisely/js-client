/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { sortBy } from 'lodash';
import { AutoExtractor, CreatableAutoExtractor } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeDownloadManyAutoExtractors } from './download-many-auto-extractors';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

describe('downloadManyAutoExtractors()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const getAllAutoExtractors = makeGetAllAutoExtractors({ host: TEST_HOST, useEncryption: false });
	const downloadManyAutoExtractors = makeDownloadManyAutoExtractors({ host: TEST_HOST, useEncryption: false });

	let createdAutoExtractors: Array<AutoExtractor>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all auto extractors
		const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID =>
			deleteOneAutoExtractor(TEST_AUTH_TOKEN, autoExtractorID),
		);
		await Promise.all(deletePromises);

		// Create three auto extractors
		const creatableAutoExtractors: Array<CreatableAutoExtractor> = [
			{
				name: 'AE1 name',
				description: 'AE1 description',

				tag: 'netflow',
				module: 'csv',
				parameters: 'a b c',
			},
			{
				name: 'AE2 name',
				description: 'AE2 description',

				tag: 'gravwell',
				module: 'fields',
				parameters: '1 2 3',
			},
			{
				name: 'AE3 name',
				description: 'AE3 description',

				tag: 'test',
				module: 'regex',
				parameters: 'abc',
			},
		];
		const createPromises = creatableAutoExtractors.map(creatable => createOneAutoExtractor(TEST_AUTH_TOKEN, creatable));
		createdAutoExtractors = await Promise.all(createPromises);
	});

	it(
		'Should download the specified auto extractors',
		integrationTest(async () => {
			const sortByName = <T extends { name: string }>(arr: Array<T>) => sortBy(arr, ae => ae.name);
			const expectedAutoExtractors = sortByName(createdAutoExtractors.slice(0, 2));
			const ids = expectedAutoExtractors.map(ae => ae.id);

			const autoExtractorContents = await downloadManyAutoExtractors(TEST_AUTH_TOKEN, { ids });
			const parsedAutoExtractorContents = sortByName(parseAutoExtractorFile(autoExtractorContents));
			expect(expectedAutoExtractors).toPartiallyEqual(parsedAutoExtractorContents);
		}),
	);
});

type AutoExtractorInFile = Pick<AutoExtractor, 'name' | 'description' | 'tag' | 'module' | 'parameters'>;
const AUTO_EXTRACTOR_KEY_MAP = {
	name: 'name',
	desc: 'description',
	tag: 'tag',
	module: 'module',
	params: 'parameters',
} as const;

const toAutoExtractorInFile = (v: string): AutoExtractorInFile =>
	v
		.split('\n')
		.map(v => v.trim())
		.filter(v => v !== '')
		.map(v => v.split(' = ') as [keyof typeof AUTO_EXTRACTOR_KEY_MAP, string])
		.map(([key, value]) => ({ key, value }))
		.reduce<AutoExtractorInFile>((acc, { key, value }) => {
			const _key = AUTO_EXTRACTOR_KEY_MAP[key];
			acc[_key] = JSON.parse(value);
			return acc;
		}, {} as AutoExtractorInFile);

const parseAutoExtractorFile = (data: string): Array<AutoExtractorInFile> => {
	return data
		.split('[[extraction]]')
		.map(v => v.trim())
		.filter(v => v !== '')
		.map(toAutoExtractorInFile);
};
