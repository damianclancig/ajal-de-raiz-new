/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export abstract class AppError extends Error {
  public abstract readonly code: string;
  public readonly isOperational: boolean;
  public readonly metadata: Record<string, any>;

  constructor(message: string, isOperational = true, metadata: Record<string, any> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    this.metadata = metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class GeneralAppError extends AppError {
  public readonly code: string;

  constructor(code: string, message: string, isOperational = true, metadata: Record<string, any> = {}) {
    super(message, isOperational, metadata);
    this.code = code;
  }
}
