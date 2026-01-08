<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Asumsi otorisasi sudah ditangani oleh middleware di level route, 
        // misalnya hanya admin yang bisa mengakses endpoint ini.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'nama_pelanggan'    => 'sometimes|required|string|max:255',
            'email'             => 'sometimes|required|email',
            'no_hp'             => 'sometimes|required|string|max:20',
            'paket_layanan'     => 'sometimes|required|string',
            'total_harga'       => 'sometimes|required|numeric|min:0',
            'status_pembayaran' => ['sometimes', 'required', Rule::in(['belum_bayar', 'sudah_dp', 'lunas'])],
            'status_pengerjaan' => ['sometimes', 'required', Rule::in(['pending', 'proses', 'revisi', 'selesai', 'dibatalkan'])],
            'progress'          => 'sometimes|required|integer|min:0|max:100',
            'sisa_tagihan'      => 'sometimes|required|numeric|min:0',
        ];
    }
}