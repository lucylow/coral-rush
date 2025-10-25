/**
 * Coral Orchestrator API Client
 * Communicates with the unified AI orchestrator backend
 */

interface OperationRequest {
  framework: string;
  operation: string;
  parameters: Record<string, any>;
}

interface WorkflowRequest {
  workflow_name: string;
  parameters: Record<string, any>;
}

interface ApiResponse {
  success: boolean;
  result?: any;
  error?: string;
  execution_time?: number;
}

class CoralOrchestratorClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/coral') {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute a single AI framework operation
   */
  async executeOperation(request: OperationRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/execute-operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Operation execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Execute a cross-framework workflow
   */
  async executeWorkflow(request: WorkflowRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Workflow execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get status of all AI frameworks
   */
  async getFrameworkStatus(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/framework-status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get framework status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available workflows
   */
  async getAvailableWorkflows(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get workflows:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get operation result by ID
   */
  async getOperationResult(operationId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/operation/${operationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get operation result:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Test specific framework capabilities
   */
  async testFramework(frameworkId: string): Promise<ApiResponse> {
    return this.executeOperation({
      framework: frameworkId,
      operation: 'test_capabilities',
      parameters: {}
    });
  }

  /**
   * Get performance metrics for all frameworks
   */
  async getPerformanceMetrics(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/performance-metrics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const coralOrchestrator = new CoralOrchestratorClient();

// Export types for use in components
export type { OperationRequest, WorkflowRequest, ApiResponse };

// Export class for custom instantiation
export default CoralOrchestratorClient;
