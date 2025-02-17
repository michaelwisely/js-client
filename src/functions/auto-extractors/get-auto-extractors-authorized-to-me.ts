/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractor, RawAutoExtractor, toAutoExtractor } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAutoExtractorsAuthorizedToMe = (context: APIContext) => {
	const path = '/api/autoextractors';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<AutoExtractor>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawAutoExtractor> | null>(raw)) ?? [];
		return rawRes.map(toAutoExtractor);
	};
};
