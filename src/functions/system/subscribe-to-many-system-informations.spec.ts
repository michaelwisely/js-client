/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, unitTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeSubscribeToManySystemInformations } from './subscribe-to-many-system-informations';

const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));

describe('subscribeToManySystemInformations()', () => {
	const subscribeToManySystemInformations = makeSubscribeToManySystemInformations({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should return a function given a valid host',
		unitTest(() => {
			const fn = () => makeSubscribeToManySystemInformations({ host: 'www.example.com', useEncryption: false });
			expect(fn).not.toThrow();
			expect(typeof fn()).toBe('function');
		}),
	);

	it(
		'Should subscribe to ping information',
		integrationTest(async () => {
			const pingSubscription = await subscribeToManySystemInformations(TEST_AUTH_TOKEN, ['ping']);
			await wait(1500);
			pingSubscription.close();

			for (const message of pingSubscription.received) {
				if ((message as any).type !== undefined) expect((message as any).type).toBe('ping');
				else expect(message).toEqual({ Resp: 'ACK' });
			}
		}),
	);
});
