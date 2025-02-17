/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserRole } from '../../models';
import { NumericID } from '../../value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeUpdateOneUserRole = (context: APIContext) => {
	return async (userID: NumericID, role: UserRole): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/admin';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const method = role === 'admin' ? 'PUT' : 'DELETE';
			const raw = await fetch(url, { ...req, method });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
