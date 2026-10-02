import { customerRepository, CustomerRecord } from '../repositories/customer.repository.js';

export class CustomerService {
  /**
   * Get aggregated guest customer directory
   */
  async getGuestCustomers(searchQuery?: string): Promise<CustomerRecord[]> {
    return await customerRepository.findAll(searchQuery);
  }

  /**
   * Get single customer by email
   */
  async getCustomerByEmail(email: string): Promise<CustomerRecord | null> {
    return await customerRepository.findByEmail(email);
  }
}

export const customerService = new CustomerService();
