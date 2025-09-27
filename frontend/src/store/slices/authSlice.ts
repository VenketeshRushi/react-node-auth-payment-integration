import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authAxios } from '@/axios/instance';
import type { AuthError, AuthState } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

const initialState: AuthState = {
  loading: false,
  error: null,
  machineId: undefined,
};

export const getMachineId = createAsyncThunk<
  string,
  void,
  { rejectValue: AuthError }
>('auth/getMachineId', async (_, { rejectWithValue }) => {
  try {
    const response =
      await authAxios.get<ApiResponse<{ machineId: string }>>(
        '/auth/machine-id'
      );

    if (response.data.success) {
      return response.data.data.machineId;
    } else {
      return rejectWithValue({
        message: response.data.message || 'Failed to get machine ID',
        errorCode: response.data.errorCode,
      });
    }
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;
    return rejectWithValue({
      message:
        err.response?.data?.message || err.message || 'Something Went Wrong!',
      errorCode: err.response?.data?.errorCode,
    });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMachineId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMachineId.fulfilled, (state, action) => {
        state.loading = false;
        state.machineId = action.payload;
      })
      .addCase(getMachineId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to get machine ID' };
      });
  },
});

export default authSlice.reducer;
