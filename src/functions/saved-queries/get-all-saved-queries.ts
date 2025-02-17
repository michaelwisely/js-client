/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSavedQuery, SavedQuery, toSavedQuery } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAllSavedQueries = (context: APIContext) => {
	const path = '/api/library?admin=true';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<SavedQuery>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawSavedQuery> | null>(raw)) ?? [];
		return rawRes.map(toSavedQuery);
	};
};
